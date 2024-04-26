package fr.alliance4u.sbiou.MageAPI.persistence.entity;

import java.util.concurrent.ThreadLocalRandom;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;

@Entity
public class Equipement {
    private @Id @GeneratedValue Long id;
    @Min(value = 1, message = "Vitality should no be inferior to 1")
    private int vitality;
    private String name;
    
    private int getRandomVitality() {
		return ThreadLocalRandom.current().nextInt(1, 14);
	}

    public Equipement() {
        this.vitality = getRandomVitality();
    }
    
    public Equipement(int vitality) {
        this.vitality = vitality>0 ? vitality : getRandomVitality();
    }

    public String getName(){
        return (this.name == null || this.name.isEmpty())? "Equipement_"+this.id : this.name;
    }
    
    public void setName(String name){
        this.name = name;
    }

    public int getVitality() {
        return vitality;
    }

    public void setVitality(int vitality) {
        this.vitality = vitality;
    }
}
