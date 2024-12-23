from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    course_name = models.CharField(max_length=50)
    course_description = models.CharField(max_length=200)
    course_credit = models.IntegerField()

    def __str__(self):
        return self.course_name

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    roll_number = models.AutoField(primary_key=True)

    def __str__(self):
        return self.user.username 

class Enrollment(models.Model):
    enrollment_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    score = models.IntegerField(default=0, null=True)
    enrollment_date = models.DateField(auto_now_add=True)
    def __str__(self):
        return self.student.user.username + " " + self.course.course_name