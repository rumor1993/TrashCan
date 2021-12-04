package com.rumor.trash.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;

@Controller
public class AdminController {

    @Value("${file.dir}")
    private String fileDir;

    @GetMapping("/home")
    public String home() {
        return "index";
    }

    @GetMapping("/admin")
    public String admin() {
        return "admin/excel_upload_form.html";
    }

    @PostMapping("/upload")
    public String saveFile(@RequestParam String itemName,
            @RequestParam MultipartFile file) throws IOException {
        System.out.println("itemName = " + itemName);
        if (!file.isEmpty()) {
            String fullPath = fileDir + file.getOriginalFilename();
            file.transferTo(new File(fullPath));
        }

        return "redirect:admin";
    }
}
