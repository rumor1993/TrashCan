package com.rumor.trash.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {

    @GetMapping("/home")
    public String home() {
        return "index";
    }

    @GetMapping("/admin")
    public String admin() {
        return "admin/admin";
    }
}
