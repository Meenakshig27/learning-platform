package com.learnsphere.repository;

import com.learnsphere.model.Lesson;
import com.learnsphere.model.Progress;
import com.learnsphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByUser(User user);
    Optional<Progress> findByUserAndLesson(User user, Lesson lesson);
}
