package com.hfstr.fotobox.webservice;

import com.hfstr.fotobox.config.YamlConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

@Controller
public class FotoboxController {

    private Random random = new Random();

    @Autowired
    YamlConfig config;

    @GetMapping("/")
    public String fotobox() {
        return "fotobox";
    }

    @GetMapping("/diashow")
    public String diashow() {
        return "diashow";
    }

    @GetMapping(
            value = "/randomImage",
            produces = MediaType.IMAGE_JPEG_VALUE
    )
    public @ResponseBody byte[] randomImage() throws IOException {
        File dir = new File(config.getSavePath());
        File[] files = dir.listFiles();
        File file = files[random.nextInt(files.length)];


        return Files.readAllBytes(Path.of(file.getPath()));
    }

    @PostMapping("/upload")
    public ResponseEntity upload(@RequestParam("image") MultipartFile file) {
        try {

            SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd HHmmssSSS");
            String timeStamp = date.format(new Date());
            String fileName = config.getSavePath() + timeStamp + ".jpg";
            Files.copy(file.getInputStream(), Path.of(fileName), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ResponseEntity("image uploaded", HttpStatus.CREATED);
    }
}
