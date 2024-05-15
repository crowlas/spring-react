package fr.alliance4u.sbiou.MageAPI.persistence.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import fr.alliance4u.sbiou.MageAPI.persistence.entity.Equipement;

public interface EquipementRepository extends CrudRepository<Equipement, Long> {
	
	@Query("SELECT b FROM Equipement b WHERE b NOT IN (SELECT DISTINCT b2 FROM Mage a join a.equipements b2)")
	Set<Equipement> findAllAvailable();
}

