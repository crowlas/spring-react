//package fr.alliance4u.sbiou.MageAPI.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.hateoas.CollectionModel;
//import org.springframework.hateoas.RepresentationModel;
//import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.HttpStatusCode;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.client.HttpServerErrorException;
//
//import fr.alliance4u.sbiou.MageAPI.persistence.entity.Equipement;
//import fr.alliance4u.sbiou.MageAPI.persistence.repository.EquipementRepository;
//
//
//@RestController
//public class EquipementRestController {
//	
//	@Autowired
//	private EquipementRepository repo;
//    
//	EquipementRestController(EquipementRepository repo) { 
//	    this.repo = repo;
//	  }
//    
//	@GetMapping("/api/equipements/availables")
//    public ResponseEntity<?> getAvailableEquipement() {
//    	CollectionModel<Equipement> resources = CollectionModel.of(repo.findAllAvailable()); 
//    	resources.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(
//    			EquipementRestController.class).getAvailableEquipement()).withSelfRel()); 
//    	return ResponseEntity.ok(resources) ;
//    }
//
//}
