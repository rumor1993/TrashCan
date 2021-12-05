package com.rumor.trash.controller;

import com.rumor.trash.repository.AdminRepository;
import com.rumor.trash.service.AdminService;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AdminRepository adminRepository;

    @GetMapping("/home")
    public String home() {
        return "index";
    }

    @GetMapping("/admin")
    public String admin() {
        return "admin/excel_upload_form.html";
    }

    @PostMapping("/upload")
    public String saveFile(@RequestParam MultipartFile file) throws Exception {
        adminService.createTrashInfoFromExcel(file);
        return "redirect:admin";
    }
}
