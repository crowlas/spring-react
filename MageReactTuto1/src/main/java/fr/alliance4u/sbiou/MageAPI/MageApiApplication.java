package fr.alliance4u.sbiou.MageAPI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.hateoas.config.EnableHypermediaSupport;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@EnableHypermediaSupport(type = EnableHypermediaSupport.HypermediaType.HAL)
@EnableWebMvc
public class MageApiApplication implements RepositoryRestConfigurer {

	public static void main(String[] args) {
		SpringApplication.run(MageApiApplication.class, args);
	}
}
