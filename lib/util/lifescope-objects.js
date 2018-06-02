'use strict';

class LSObj {
  constructor(obj) {
    this.id = obj.id || 0;
  }
}

class Connection extends LSObj {
  constructor(obj) {
    super(obj);
    this.auth = obj.auth || {
      status: {
        authorized: false,
        complete: false
      },
      redirectUrl: ''
    };
    this.enabled = obj.enabled || false;
    this.endpoint_data = obj.endpoint_data || '';
    this.frequency = obj.frequency || 0;
    this.last_run = obj.last_run || Date.now();
    this.name = obj.name || '';
    this.permissions = obj.permissions || '';
    this.provider = new Provider(obj.provider) || {};
    this.provider_id = obj.provider_id || '';
    this.provider_id_string = obj.provider_id_string || '';
    this.provider_name = obj.provider_name || '';
    this.remote_connection_id = obj.remote_connection_id || '';
    this.remote_connection_id_string = obj.remote_connection_id_string || '';
    this.status = obj.status || '';
    this.user_id = obj.user_id || '';
    this.user_id_string = obj.user_id_string || '';
  }
}

class AssociationSession extends LSObj {
  constructor(obj) {
    super(obj);
    this.connection_id =  obj.connection_id || '';
    this.connection_id_string =  obj.remote_connection_id_string || '';
    this.token =  obj.token || '';
    this.token_string =  obj.token_string || '';
    this.ttl =  obj.ttl || '';
  }
}

class Contact extends LSObj {
  constructor(obj) {
    super(obj);
    this.avatar_url = obj.avatar_url || '';
    this.connection = obj.hydratedConnection ? new Connection(obj.hydratedConnection) : {};
    this.connection_id_string = obj.connection_id_string || '';
    this.created = obj.created || '';
    this.handle = obj.handle || '';
    this.identifier = obj.identifier || '';
    this.name = obj.name || '';
    this.provider_name = obj.provider_name || '';
    this.remote_id = obj.remote_id || '';
    this.tagMasks = obj.tagMasks || {
      added: [],
      removed: [],
      source:[]
    };
    this.updated = obj.updated || '';
    this.user_id = obj.user_id || '';
    this.user_id_string = obj.user_id_string || '';
  }

  get tags() {
    let returned = this.tagMasks.source || [];

    _.pullAll(returned, this.tagMasks.removed);

    returned = returned.concat(this.tagMasks.added);

    return returned;
  }
}

class Content extends LSObj {
  constructor(obj) {
    super(obj);
    this.connection = obj.hydratedConnection ? new Connection(obj.hydratedConnection) : {};
    this.connection_id_string = obj.connection_id_string || '';
    this.created = obj.created || '';
    this.embed_content = obj.embed_content || '';
    this.embed_format = obj.embed_format || '';
    this.embed_thumbnail = obj.embed_thumbnail || '';
    this.identifier = obj.identifier || '';
    this.mimetype = obj.mimetype || '';
    this.owner = obj.owner || '';
    this.provider_name = obj.provider_name || '';
    this.remote_id = obj.remote_id || '';
    this.tagMasks = obj.tagMasks || {
      added: [],
      removed: [],
      source:[]
    };
    this.text = obj.text || '';
    this.title = obj.title || '';
    this.type = obj.type || '';
    this.updated = obj.updated || '';
    this.url = obj.url || '';
    this.user_id = obj.user_id || '';
    this.user_id_string = obj.user_id_string || '';
  }

  get tags() {
    let returned = this.tagMasks.source || [];

    _.pullAll(returned, this.tagMasks.removed);

    returned = returned.concat(this.tagMasks.added);

    return returned;
  }
}

class Event extends LSObj {
  constructor(obj) {
    super(obj);

    this.connection = obj.hydratedConnection ? new Connection(obj.hydratedConnection) : {};
    this.connection_id_string = obj.connection_id_string || '';
    this.contact_interaction_type = obj.contact_interaction_type || '';
    this.contacts = _.map(obj.hydratedContacts, function(contact) {
      return new Contact(contact);
    }) || [];
    this.content = _.map(obj.hydratedContent, function(content) {
      return new Content(content);
    }) || [];
    this.context = obj.context || '';
    this.created = obj.created || '';
    this.datetime = obj.datetime || '';
    this.identifier = obj.identifier || '';
    // this.provider = obj.provider || new Provider();
    this.provider_name = obj.provider_name || '';
    this.source = obj.source || '';
    this.tagMasks = obj.tagMasks || {
      added: [],
      removed: [],
      source:[]
    };
    this.type = obj.type || '';
    this.updated = obj.updated || '';
    this.user_id = obj.user_id || '';
    this.user_id_string = obj.user_id_string || '';
  }

  get tags() {
    let returned = this.tagMasks.source || [];

    _.pullAll(returned, this.tagMasks.removed);

    returned = returned.concat(this.tagMasks.added);

    return returned;
  }

  get displayedTags() {
    let returned = this.tags;

    _.each(this.contacts, function(contact) {
      returned = returned.concat(contact.tags);
    });

    _.each(this.content, function(content) {
      returned = returned.concat(content.tags);
    });

    return returned;
  }
}

class Location extends LSObj {
  constructor(obj) {
    super(obj);
    this.connection = obj.connection || new Connection();
    this.connection_id_string = obj.connection_id_string || '';
    this.created = obj.created || '';
    this.datetime = obj.datetime || '';
    this.estimated = obj.estimated || false;
    this.geo_format = obj.geo_format || '';
    this.geolocation = obj.geolocation || [];
    this.identifier = obj.identifier || '';
    this.updated = obj.updated || '';
    this.user_id = obj.user_id || '';
    this.user_id_string = obj.user_id_string || '';
  }
}

class Provider extends LSObj {
  constructor(obj) {
    super(obj);
    this.sources = obj.sources || {};
    this.name = obj.name || '';
    this.remote_map_id = obj.remote_map_id || '';
    this.remote_map_id_string = obj.remote_map_id_string || '';
  }
}

class Person extends LSObj {
  constructor(obj) {
    super(obj);
  }
}

class Place extends LSObj {
  constructor(obj) {
    super(obj);
  }
}

class Search extends LSObj {
  constructor(obj) {
    super(obj);
    this.count = obj.count || 0;
    this.favorited = obj.favorited || false;
    this.filters = obj.filters || [{
      data: {},
      name: '',
      type: ''
    }];
    this.hash = obj.hash || '';
    this.icon = obj.icon || '';
    this.icon_color = obj.icon_color || '';
    this.last_run = obj.last_run || '';
    this.name = obj.name || '';
    this.query = obj.query || '';
    this.user_id = obj.user_id || '';
    this.user_id_string = obj.user_id_string || '';
  }
}

class Session extends LSObj {
  constructor(obj) {
    super(obj);
    this.created = obj.created || '';
    this.csrf_secret = obj.csrf_secret || '';
    this.expires = obj.expires || '';
    this.ip = obj.ip || '';
    this.meta = obj.meta || {
      agent: '',
      browser: {
        family: '',
        version: ''
      },
      device: {
        family: '',
        version: ''
      },
      os: {
        family: '',
        version: ''},
    };
    this.persist = obj.persist || false;
    this.token = obj.token || '';
    this.ttl = obj.ttl || '';
    this.user_id = obj.user_id || '';
    this.user_id_string = obj.user_id_string || '';
  }
}

class Tag extends LSObj {
  constructor(obj) {
    super(obj);
    this.created = obj.created || Date.now();
    this.tag = obj.tag || '';
    this.update = obj.update || Date.now();
    this.user_id = obj.user_id || '';
    this.user_id_string = obj.user_id_string || '';
  }
}

class Thing extends LSObj {
  constructor(id, obj) {
    super(obj);
    this.connection = obj.connection || '';
    this.connection_id_string = obj.connection_id_string || '';
  }
}

class User extends LSObj {
  constructor(obj) {
    super(obj);
    this.name = obj.name || '';
    this.is_active = obj.is_active || false;
    this.joined = obj.joined || Date.now();
    this.last_login = obj.last_login || Date.now();
    this.settings = obj.settings || {
      explorer: {
        initial_searches: false
      }
    };
    this.social_accounts = obj.social_accounts || [];
    this.subscriptions = obj.subscriptions || [];
    this.age = obj.age || 0;
    this.accountType = obj.accountType || {}; //type: [AccountTypeSchema]
    this.contacts = obj.contacts || {
      email: '',
      phones: []
    };
    this.address = obj.address || {}; //type: AddressSchema
    this.otherData = obj.otherData || {}; //type: mongoose.Schema.Types.Mixed
  }
}

export default {
  LSObj,
  Connection,
  AssociationSession,
  Contact,
  Content,
  Event,
  Location,
  Provider,
  Person,
  Place,
  Search,
  Session,
  Tag,
  Thing,
  User
};


