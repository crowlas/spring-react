package fr.alliance4u.sbiou.MageAPI.persistence.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import fr.alliance4u.sbiou.MageAPI.persistence.entity.Mage;


public interface MageRepository extends PagingAndSortingRepository<Mage, Long>, CrudRepository<Mage, Long> {
	Page<Mage> findByNameContainingAllIgnoreCase(String name, Pageable pageable);
	
}
