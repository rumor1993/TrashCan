package com.rumor.trash.controller;

import com.rumor.trash.entity.Trash;
import com.rumor.trash.repository.TrashRepository;
import com.rumor.trash.service.TrashService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TrashController {

    private final TrashRepository trashRepository;
    private final TrashService trashService;

    @GetMapping("/trash")
    public List<Trash> trash() {
        List<Trash> trashList = trashRepository.findAll();
        return trashList;
    }

}
