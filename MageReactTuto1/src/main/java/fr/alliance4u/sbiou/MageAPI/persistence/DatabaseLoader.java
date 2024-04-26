package fr.alliance4u.sbiou.MageAPI.persistence;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import fr.alliance4u.sbiou.MageAPI.persistence.entity.Equipement;
import fr.alliance4u.sbiou.MageAPI.persistence.entity.Mage;
import fr.alliance4u.sbiou.MageAPI.persistence.repository.EquipementRepository;
import fr.alliance4u.sbiou.MageAPI.persistence.repository.MageRepository;

@Component
public class DatabaseLoader implements CommandLineRunner {

	private final MageRepository repoMage;
	private final EquipementRepository repoEquip;

    public DatabaseLoader(MageRepository repoMage, EquipementRepository repoEquip) {
        this.repoMage = repoMage;
        this.repoEquip = repoEquip;
    }

    @Override
    public void run(String... strings) throws Exception {
    	for (int i = 0; i < 10; i++) {
    		this.repoMage.save(new Mage());
            this.repoEquip.save(new Equipement());
		}    	
    }
}