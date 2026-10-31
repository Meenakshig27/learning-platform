package com.learnsphere.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
@Getter @Setter @NoArgsConstructor
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    private String category;
    @Column(name = "course_level")
    private String level;
    private int hours;
    @Column(length = 1000)
    private String description;
    @Column(name = "video_id", length = 20)
    private String videoId;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    private List<Lesson> lessons = new ArrayList<>();

    @OneToOne(mappedBy = "course", cascade = CascadeType.ALL)
    private Quiz quiz;
}
