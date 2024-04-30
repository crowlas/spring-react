/*
 * Copyright 2015 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package fr.alliance4u.sbiou.MageAPI.controller.event;

import static fr.alliance4u.sbiou.MageAPI.controller.event.WebSocketConfiguration.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import fr.alliance4u.sbiou.MageAPI.persistence.entity.Mage;

/**
 * @author Greg Turnquist
 */
// tag::code[]
@Component
@RepositoryEventHandler(Mage.class)
public class EventHandler {

	private final SimpMessagingTemplate websocket;

	private final EntityLinks entityLinks;

	public EventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
		this.websocket = websocket;
		this.entityLinks = entityLinks;
	}

	@HandleAfterCreate
	public void newEmployee(Mage mage) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/newMage", mage.getName());
	}

	@HandleAfterDelete
	public void deleteEmployee(Mage mage) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/deleteMage", mage.getName());
	}

	@HandleAfterSave
	public void updateEmployee(Mage mage) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/updateMage", mage.getName());
	}

	/**
	 * Take an {@link Mage} and get the URI using Spring Data REST's {@link EntityLinks}.
	 *
	 * @param mage
	 */
	private String getPath(Mage mage) {
		return this.entityLinks.linkForItemResource(mage.getClass(),
				mage.getId()).toUri().getPath();
	}

}
// end::code[]
