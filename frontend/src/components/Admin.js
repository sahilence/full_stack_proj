import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import { useNavigate } from 'react-router-dom';
import './Styles.css';

const Admin = () => {
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axiosInstance.get('dashboard/');
                setObjects(response.data);
                console.log(response.data[0]);
            }
            catch (e) {
                localStorage.removeItem('token');
                navigate('/login');
            }
            finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }
    , [navigate]);

    const handleUpdate = async (enrollmentID, newScore) => {
        try {
            const payload = {'enrollment_id': enrollmentID, 'score': newScore};
            await axiosInstance.put('enrollments/update_score/', payload);
            alert('Course updated successfully');
            window.location.reload();
        }
        catch (e) {
            console.error('Error updating course', e);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };


    return (
        <div className="dashboard-container">
            <h2>Admin Dashboard</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h3>Enrolled Courses</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Student Roll Number</th> 
                                <th>Course Name</th>
                                <th>Enrollment ID</th>
                                <th>Score</th>
                                <th>Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {objects.map((object) => (
                                <tr key={object.enrollment_id}>
                                    <td>{object.student.roll_number}</td>
                                    <td>{object.course.course_name}</td>
                                    <td>{object.enrollment_id}</td>
                                    <td>{object.score}</td>
                                    <td>
                                        <button onClick={() => handleUpdate(object.enrollment_id, prompt('Enter new score'))}>Update</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <br />
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Admin;