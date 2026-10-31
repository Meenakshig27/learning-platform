package com.learnsphere.repository;

import com.learnsphere.model.Course;
import com.learnsphere.model.Enrollment;
import com.learnsphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByUserAndCourse(User user, Course course);
    List<Enrollment> findByUser(User user);
}
