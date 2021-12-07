package com.rumor.trash.controller;

import com.rumor.trash.entity.Trash;
import com.rumor.trash.repository.TrashRepository;
import com.rumor.trash.service.TrashService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class TrashController {
    private final TrashRepository trashRepository;
    private final TrashService trashService;

    @GetMapping("/trash")
    public List<Trash> trashFromLocation(@RequestParam("region") String region) {
        if ("".equals(region)) return trashRepository.findAll();
        return trashRepository.findByRegionContaining(region);
    }

    @GetMapping("/trash/{id}")
    public Trash trashOne(@PathVariable("id") Long id) {
        Trash trash = trashRepository.findById(id).orElse(null);
        return trash;
    }
}
