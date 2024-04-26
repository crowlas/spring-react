package fr.alliance4u.sbiou.MageAPI.persistence.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import fr.alliance4u.sbiou.MageAPI.persistence.entity.Equipement;

public interface EquipementRepository extends CrudRepository<Equipement, Long> {
}
