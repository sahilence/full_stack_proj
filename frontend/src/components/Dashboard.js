import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import { useNavigate } from 'react-router-dom';
import './Styles.css';

const Dashboard = () => {
    const [objects, setObjects] = useState([]);
    const [avilableObjects, setAvailableObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axiosInstance.get('dashboard/');
                // whichever objects in which enrollment_id exists will be set to objects
                // remaining will be set to available objects
                setObjects(response.data.filter((object) => object.enrollment_id));
                setAvailableObjects(response.data.filter((object) => !object.enrollment_id && object.course_id));
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
    }, [navigate]);

    const handleEnroll = async (courseId) => {
        try {
            const payload = {'course_id': courseId};
            await axiosInstance.post('enrollments/enroll/', payload);
            alert('Course enrolled successfully');
            window.location.reload();
        }   
        catch (e) {
            console.error('Error enrolling course', e);
        }
    };
    
    const handleDrop = async (enrollmentId) => {
        try {
            console.log(enrollmentId);
            const payload = {'enrollment_id': enrollmentId};
            console.log(payload);
            await axiosInstance.delete('enrollments/drop/', {data: payload});
            alert('Course dropped successfully');
            window.location.reload();
        }
        catch (e) {
            if(e.response.status === 400) {
                alert('Cannot drop course. Course has already been graded.');
            };
            console.error('Error dropping course', e);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
            <div className="dashboard-container ">
            <h2>Dashboard</h2>
            {loading ? <p className="loading-text">Loading...</p> : (
                <div>                    
                    <h3>Your Courses</h3>
                    {objects.length === 0 ? (
                        <p className="no-courses">You are not enrolled in any courses.</p>
                    ) : (
                        <ul>
                        {objects.map((object) => (
                            <li key={object.course.course_id}>
                            {object.course.course_name} 
                            <span style = {{textAlign: 'right'}}> {object.score !== 0 ? (object.score) : null}</span>
                            {object.score === 0 && <button onClick={() => handleDrop(object.enrollment_id)}>Drop</button>}
                        </li>
                        ))}
                    </ul>
                    )}
                    <h3>Available Courses</h3>
                    {avilableObjects.length === 0 ? (
                        <p className="no-courses">No courses available to enroll.</p>
                    ) : (
                        <ul>
                        {avilableObjects.map((object) => (
                            <li key={object}>
                            {object.course_name}
                            <button onClick={() => handleEnroll(object.course_id)}>Enroll</button>
                            </li>
                        ))}
                    </ul>
                    )
                }
            </div>
        )}
        <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
    );
};


export default Dashboard;