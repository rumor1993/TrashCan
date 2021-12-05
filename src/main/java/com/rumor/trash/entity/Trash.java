package com.rumor.trash.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trash {

    @Id
    @GeneratedValue
    @Column(name = "trash_id")
    private Long id;
    private String region;
    private String controlNumber;
    private String address;
    private String location;
    private String point;
    private String type;
    private String form;
    private String installDate;
}
