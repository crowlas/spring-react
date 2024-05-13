package fr.alliance4u.sbiou.MageAPI.persistence.entity;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Version;
import jakarta.validation.constraints.Min;

@Entity
public class Mage {
    private @Id @GeneratedValue Long id;
    @Min(value = 5, message = "Vitality should no be inferior to 5")
    private int vitality;
    private String name;
    
    @OneToMany
    private Set<Equipement> equipements = new HashSet<>();
    
    private @Version @JsonIgnore Long version;
    
    private int getRandomVitality() {
		return ThreadLocalRandom.current().nextInt(5, 43);
	}

    public Mage() {
        this.vitality = getRandomVitality();
    }

    public Mage(int vitality) {
    	this.vitality = vitality>0 ? vitality : getRandomVitality();
    }
    
    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
    
    public String getName(){
    	return (this.name == null || this.name.isEmpty())? "Mage_"+this.id : this.name;
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
    
    public Set<Equipement> getEquipements() {
		return equipements;
	}

	public void setEquipements(Set<Equipement> equipements) {
		this.equipements = equipements;
	}
	
	public void addEquipements(Equipement one) {
		this.equipements.add(one);
	}
	
	public void removeEquipements(Equipement one) {
		this.equipements.remove(one);
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}
}
