package com.rest.splitter.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String expenseTitle;
    private Double expenseAmount;
    private LocalDateTime expenseDateTime;
    private String partnerName;

    public Expense() {}

    public Expense(String expenseTitle, Double expenseAmount, LocalDateTime expenseDateTime, String partnerName) {
        this.expenseTitle = expenseTitle;
        this.expenseAmount = expenseAmount;
        this.expenseDateTime = expenseDateTime;
        this.partnerName = partnerName;
    }

    // Getters and setters omitted for brevity
}