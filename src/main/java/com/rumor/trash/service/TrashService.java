package com.rumor.trash.service;

import com.rumor.trash.entity.Trash;
import com.rumor.trash.repository.TrashRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrashService {

    private final TrashRepository trashRepository;


}
