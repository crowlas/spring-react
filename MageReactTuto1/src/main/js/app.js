'use strict';

import MageList from './components/mageList';
import AppEquipement from './components/equipementList';
import {CreateDialog} from './components/dialog';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
var stompClient = require('./websocket-listener')
const client = require('./connection/client');

const follow = require('./connection/follow'); // function to hop multiple links by "rel"

function followApi(relArray) {
	return follow(client, '/api', relArray);
}

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {mages: [], attributes: [], page: 1, pageSize: 2, links: {}, logs: ""}; // variables gloabal
		// ecouteurs
		this.updatePageSize = this.updatePageSize.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
		this.messageWebsocket = this.messageWebsocket.bind(this);
		this.initMessageWebsocket = this.initMessageWebsocket.bind(this);
	}
	
	loadFromServer(pageSize) {
		followApi([{rel: 'mages', params: {size: pageSize}}]
		).then(mageCollection => {
			return client({
				method: 'GET',
				path: mageCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				this.links = mageCollection.entity._links;
				return mageCollection;
			});
		}).then(mageCollection => {
			return mageCollection.entity._embedded.mages.map(mage =>
					client({
						method: 'GET',
						path: mage._links.self.href
					})
			);
		}).then(magePromises => {
			return when.all(magePromises);
		}).done(mages => {
			this.setState({
				mages: mages,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: this.links
			});
		});
		this.initMessageWebsocket();
	}
	
	onUpdate(rel, newRel) {
		client({
			method: 'PUT',
			path: rel.entity._links.self.href,
			entity: newRel,
			headers: {
				'Content-Type': 'application/json',
				'If-Match': rel.headers.Etag
			}
		}).done(response => {
			this.refreshCurrentPage();
		}, response => {
			if (response.status.code === 412) {
				alert('DENIED: Unable to update ' +
					rel.entity._links.self.href + '. Your copy is stale.');
			}
		});
	}
	
	onCreate(newEmployee) {
		followApi(['mages']).then(response => {
			return client({
				method: 'POST',
				path: response.entity._links.self.href,
				entity: newEmployee,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return followApi([{rel: 'mages', params: {'size': this.state.pageSize}}]);
		}).done(response => {
			if (typeof response.entity._links.last !== "undefined") {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		});
		this.initMessageWebsocket();
	}

	onDelete(rel) {
		client({method: 'DELETE', path: rel.entity._links.self.href}).done(response => {
			this.loadFromServer(this.state.pageSize);
		});
	}	
	
	onNavigate(navUri) {
		client({
			method: 'GET',
			path: navUri
		}).then(mageCollection => {
			this.links = mageCollection.entity._links;
			this.page = mageCollection.entity.page;

			return mageCollection.entity._embedded.mages.map(mage =>
					client({
						method: 'GET',
						path: mage._links.self.href
					})
			);
		}).then(magePromises => {
			return when.all(magePromises);
		}).done(mages => {
			this.setState({
				mages: mages,
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				page: this.page,
				links: this.links
			});
		});
		this.initMessageWebsocket();
	}
	
	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize);
		}
	}
	
	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
		stompClient.register([
			{route: '/topic/newMage', callback: this.messageWebsocket},
			{route: '/topic/updateMage', callback: this.messageWebsocket},
			{route: '/topic/deleteMage', callback: this.messageWebsocket}
		]);
	}
	
	initMessageWebsocket(message) {
		document.getElementById("alertMajText").textContent="The page is up to date.";
		document.getElementById("refreshButton").setAttribute('disabled', 'true');
	}
	
	messageWebsocket(message) {
		document.getElementById("alertMajText").textContent="Change detected : ";
		document.getElementById("refreshButton").removeAttribute('disabled');
	}
	
	refreshCurrentPage(message) {
		followApi([{rel: 'mages',
			params: {
				size: this.state.pageSize,
				page: this.state.page.number
			}
		}]).then(mageCollection => {
			this.links = mageCollection.entity._links;
			this.page = mageCollection.entity.page;
	
			return mageCollection.entity._embedded.mages.map(mage => {
				return client({
					method: 'GET',
					path: mage._links.self.href
				})
			});
		}).then(magePromises => {
			return when.all(magePromises);
		}).then(mages => {
			this.setState({
				page: this.state.page,
				mages: mages,
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
		this.initMessageWebsocket();
	}

	render() {
		return (
			<div>
				<h1>Mage UI (<span>A demo project by Samuel Biou</span>)</h1>
				
				<p>This interface give an easy understable of the mage's' world.</p>
				<div id='alertMaj'>
					<span id='alertMajText'></span>
					<button id='refreshButton' onClick={this.refreshCurrentPage}>Refresh the page</button>
				</div>
				<div>
	                <h2>List of mages</h2>
	                <CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
					<MageList mages={this.state.mages}
							  links={this.state.links}
							  pageSize={this.state.pageSize}
							  attributes={this.state.attributes}
							  onNavigate={this.onNavigate}
							  onUpdate={this.onUpdate}
							  onDelete={this.onDelete}
							  updatePageSize={this.updatePageSize}/>
	            </div>
	            <AppEquipement/>            
            </div>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
)