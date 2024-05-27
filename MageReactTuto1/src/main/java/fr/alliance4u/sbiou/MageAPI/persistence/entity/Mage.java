package fr.alliance4u.sbiou.MageAPI.persistence.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Version;

@Entity
public class Mage {
    private @Id @GeneratedValue Long id;
    
    private String name;
    
    @Lob
    @Column
    private String description;
    
    @OneToMany
    private Set<Equipement> equipements = new HashSet<>();
    
    private @Version @JsonIgnore Long version;

    public Mage() {}
    
    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
    
    public String getName(){
    	return (this.name == null || this.name.isEmpty())? "Article_"+this.id : this.name;
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
