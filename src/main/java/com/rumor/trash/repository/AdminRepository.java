package com.rumor.trash.repository;

import com.rumor.trash.entity.Trash;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Trash, Integer> {
}
