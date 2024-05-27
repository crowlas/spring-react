package fr.alliance4u.sbiou.MageAPI.controller;
import org.springframework.data.rest.webmvc.RepositoryLinksResource;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.stereotype.Component;


@Component
public class AuthLinkProcessor implements RepresentationModelProcessor<RepositoryLinksResource> {

    @Override
    public RepositoryLinksResource process(RepositoryLinksResource resource) {
    	resource.add(
    			Link.of("/api/mages/search/findByNameContainingAllIgnoreCase").withRel(LinkRelation.of("magesSearch")) 
                .expand(resource.getLinks()));
        return resource;
    }
    
    
}