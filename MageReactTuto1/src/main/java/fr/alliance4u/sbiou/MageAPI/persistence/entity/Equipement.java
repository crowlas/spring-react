package fr.alliance4u.sbiou.MageAPI.persistence.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.concurrent.ThreadLocalRandom;

@Entity
public class Equipement {
    private @Id @GeneratedValue Long id;
    private int vitality;

    public Equipement() {
        this.vitality = ThreadLocalRandom.current().nextInt(1, 14);
    }

    public String getName(){
        return "Equipement"+this.id;
    }

    public Equipement(int vitality) {
        this.vitality = vitality;
    }

    public int getVitality() {
        return vitality;
    }

    public void setVitality(int vitality) {
        this.vitality = vitality;
    }
}
