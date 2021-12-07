package com.rumor.trash.repository;

import com.rumor.trash.entity.Trash;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrashRepository extends JpaRepository<Trash, Long> {
    List<Trash> findByRegionContaining(String region);
}
