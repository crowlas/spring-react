package fr.alliance4u.sbiou.MageAPI.persistence;

import java.util.HashSet;
import java.util.Set;

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
    		Mage mage = new Mage();
    		Set<Equipement> equips = new HashSet<>();
    		for (int y = 0; y < i/2; y++) {
    			equips.add(new Equipement());
    		}
    		this.repoEquip.saveAll(equips);
    		mage.setEquipements(equips);
            this.repoMage.save(mage);
		}    	
    }
}