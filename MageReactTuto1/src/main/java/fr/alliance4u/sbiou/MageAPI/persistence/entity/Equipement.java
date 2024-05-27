package fr.alliance4u.sbiou.MageAPI.persistence.entity;

import java.util.concurrent.ThreadLocalRandom;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

@Entity
public class Equipement {
	private static int index = 0;
    private @Id @GeneratedValue Long id;
    @Min(value = 1, message = "Vitality should not be inferior to 1.")
    private int vitality;
    
    @Size(max = 20, message = "Le nom ne doit pas dépasser 20 charactères.")
    private String name;
    private String description;
    
    private int getRandomVitality() {
		return ThreadLocalRandom.current().nextInt(1, 14);
	}

    public Equipement() {
        this.name = "Prize_"+index;
    	this.vitality = getRandomVitality();
    	index++;
    }
    
    public Equipement(int vitality) {
        this.vitality = vitality>0 ? vitality : getRandomVitality();
    }

    public String getName(){
        return this.name;
    }
    
    public void setName(String name){
        this.name = name;
    }
    
    public String getDescription() {
		return description;
	}
    
    public void setDescription(String description) {
		this.description = description;
	}

    public int getVitality() {
        return vitality;
    }

    public void setVitality(int vitality) {
        this.vitality = vitality;
    }
}
