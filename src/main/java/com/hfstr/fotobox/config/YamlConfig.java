package com.hfstr.fotobox.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;


@Data
@Configuration
@EnableConfigurationProperties
@ConfigurationProperties("fotobox")
public class YamlConfig {

    private String savePath;

}