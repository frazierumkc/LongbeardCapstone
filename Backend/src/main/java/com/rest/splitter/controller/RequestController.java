package com.rest.splitter.controller;

import com.rest.splitter.model.Request;
import com.rest.splitter.repository.RequestRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:3000")
public class RequestController {

    private final RequestRepository requestRepository;

    public RequestController(RequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    @GetMapping
    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }
}
