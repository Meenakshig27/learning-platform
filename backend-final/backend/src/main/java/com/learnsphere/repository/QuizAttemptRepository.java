package com.learnsphere.repository;

import com.learnsphere.model.QuizAttempt;
import com.learnsphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserOrderByIdAsc(User user);
}
