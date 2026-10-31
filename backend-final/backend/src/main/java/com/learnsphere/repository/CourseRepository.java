package com.learnsphere.repository;

import com.learnsphere.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    @Modifying
    @Transactional
    @Query("update Course c set c.videoId = :videoId where c.title = :title")
    int setVideo(@Param("title") String title, @Param("videoId") String videoId);
}
