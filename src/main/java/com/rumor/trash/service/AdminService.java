package com.rumor.trash.service;

import com.rumor.trash.entity.Trash;
import com.rumor.trash.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final AdminRepository adminRepository;

    @Value("${file.dir}") private String fileDir;

    public void createTrashInfoFromExcel(MultipartFile file) throws Exception {
        if (file.isEmpty()) throw new Exception("파일이 존재하지 않습니다.");

        List<Trash> dataList = new ArrayList<>();
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());

        if (!extension.equals("xlsx") && !extension.equals("xls"))
            throw new IOException("엑셀파일만 업로드 해주세요.");

        Workbook workbook = getWorkBook(file, extension);

        if (extension.equals("xlsx")) {
            workbook = new XSSFWorkbook(file.getInputStream());
        } else if (extension.equals("xls")) {
            workbook = new HSSFWorkbook(file.getInputStream());
        }

        Sheet sheet = workbook.getSheetAt(0);
        for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) { // 4

            Row row = sheet.getRow(i);
            Trash data = Trash.builder()
                    .region(row.getCell(1).getStringCellValue())
                    .controlNumber(row.getCell(2).getStringCellValue())
                    .address(row.getCell(3).getStringCellValue())
                    .location(row.getCell(4).getStringCellValue())
                    .point(row.getCell(5).getStringCellValue())
                    .type(row.getCell(6).getStringCellValue())
                    .form(row.getCell(7).getStringCellValue())
                    .installDate(row.getCell(8).getCellType() == CellType.NUMERIC
                            ? String.valueOf(row.getCell(8).getNumericCellValue())
                            : row.getCell(8).getStringCellValue())
                    .build();

            dataList.add(data);
        }
        adminRepository.saveAll(dataList);
    }

    private Workbook getWorkBook(MultipartFile file, String extension) throws IOException {
        if (extension.equals("xlsx")) {
            return new XSSFWorkbook(file.getInputStream());
        } else {
            return new HSSFWorkbook(file.getInputStream());
        }
    }
}
