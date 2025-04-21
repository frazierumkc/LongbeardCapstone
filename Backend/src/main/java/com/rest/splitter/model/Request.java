package com.rest.splitter.model;

import jakarta.persistence.*;

@Entity
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fromUser;
    private String toUser;
    private Double amount;
    private String message;

    public Request() {}

    public Request(String fromUser, String toUser, Double amount, String message) {
        this.fromUser = fromUser;
        this.toUser = toUser;
        this.amount = amount;
        this.message = message;
    }

    // Getters and setters omitted for brevity
}
