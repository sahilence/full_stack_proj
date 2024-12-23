from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Course, Student, Enrollment
from .serializers import CourseSerializer, StudentSerializer, EnrollmentSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token

class LoginView(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'message': 'Login successful', 'token': token.key, 'is_staff': user.is_staff})
        return Response({'message': 'Invalid credentials'}, status=400)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.AllowAny]

class StudentDashboard(APIView):
    def get(self, request):
        token = request.headers['Authorization'].split(' ')[1]
        user = Token.objects.get(key=token).user
        if user.is_staff:
            enrollments = Enrollment.objects.all()
            serializer = EnrollmentSerializer(enrollments, many=True)
            return Response(serializer.data)
        student = Student.objects.get(user=user)
        enrollments = Enrollment.objects.filter(student=student)
        serializer = EnrollmentSerializer(enrollments, many=True)
        available_courses = Course.objects.exclude(enrollment__student=student) 
        available_serializer = CourseSerializer(available_courses, many=True)
        return Response(serializer.data + available_serializer.data)

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.AllowAny]
    @action(detail=False, methods=['post'])
    def enroll(self, request):
        token = request.headers['Authorization'].split(' ')[1]
        user = Token.objects.get(key=token).user
        student = Student.objects.get(user=user)
        course_id = request.data['course_id']
        course = Course.objects.get(course_id=course_id)
        Enrollment.objects.create(student=student, course=course)
        return Response({'message': 'Enrolled successfully'})
    
    @action(detail=False, methods=['delete'])
    def drop(self, request):
        token = request.headers['Authorization'].split(' ')[1]
        user = Token.objects.get(key=token).user
        student = Student.objects.get(user=user)
        enrollment_id = request.data['enrollment_id']
        enrollment = Enrollment.objects.get(enrollment_id=enrollment_id, student=student)
        print(enrollment.score)
        if enrollment.score > 0:
            return Response({'message': 'Cannot drop course with score'}, status=400)
        enrollment.delete()
        return Response({'message': 'Dropped successfully'})
    
    @action(detail=False, methods=['put'])
    def update_score(self, request):
        token = request.headers['Authorization'].split(' ')[1]
        user = Token.objects.get(key=token).user
        if not user.is_staff:
            return Response({'message': 'You are not authorized to update score'}, status=403)
        enrollment_id = request.data['enrollment_id']
        score = request.data['score']
        enrollment = Enrollment.objects.get(enrollment_id=enrollment_id)
        enrollment.score = score
        enrollment.save()
        return Response({'message': 'Score updated successfully'})
        