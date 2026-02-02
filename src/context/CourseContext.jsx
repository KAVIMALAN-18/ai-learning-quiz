import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import courseService from '../services/course.service';
import { courses as localCourses } from '../data/courses';

const CourseContext = createContext();

export const useCourses = () => {
    const context = useContext(CourseContext);
    if (!context) {
        throw new Error('useCourses must be used within CourseProvider');
    }
    return context;
};

export const CourseProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const lastFetchRef = useRef(0);

    const fetchCourses = async (force = false) => {
        const now = Date.now();
        if (!force && (now - lastFetchRef.current < 1500)) return;
        lastFetchRef.current = now;

        try {
            setLoading(true);
            setError(null);
            const data = await courseService.list();

            // If data is empty or invalid, fallback to local
            if (!data || data.length === 0) {
                console.warn("Backend returned no courses, using local fallback.");
                setCourses(localCourses);
            } else {
                setCourses(data);
            }
        } catch (err) {
            console.error("Failed to load courses from backend, falling back to local data:", err);
            setError(err.message);
            // Fallback to local data on error
            setCourses(localCourses);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const value = useMemo(() => ({
        courses,
        loading,
        error,
        refreshCourses: fetchCourses
    }), [courses, loading, error]);

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    );
};
