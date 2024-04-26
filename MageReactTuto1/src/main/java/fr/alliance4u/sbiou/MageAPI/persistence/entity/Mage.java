package fr.alliance4u.sbiou.MageAPI.persistence.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.concurrent.ThreadLocalRandom;

@Entity
public class Mage {
    private @Id @GeneratedValue Long id;
    private int vitality;

    public Mage() {
        this.vitality = ThreadLocalRandom.current().nextInt(1, 43);
    }

    public String getName(){
        return "Mage_"+this.id;
    }

    public Mage(int vitality) {
        this.vitality = vitality;
    }

    public int getVitality() {
        return vitality;
    }

    public void setVitality(int vitality) {
        this.vitality = vitality;
    }
}
