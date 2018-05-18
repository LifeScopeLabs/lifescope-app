import lifescopeObjects from './lifescope-objects';

export default function(self) {
  debugger;
  console.log("assemble-filters");
  console.log(lifescopeObjects);
  let connectorFilters, tagFilters, whatFilters, whenFilters, whoFilters;

  let filters = {};
  let filterList = self.$store.state.currentSearch.filters;
  let query = self.$store.state.currentSearch.query;

  let tags = query ? query.match(/#[A-Za-z0-9-]+/g) : [];

  for (let i = 0; i < filterList.length; i++) {
    let filter, operand;
    let type = filterList[i].type;
    let data = filterList[i].data;

    // FIXME: Pluck geofilter properties.

    if (type === 'who') {
      if (data.contact) {
        filter = {
          $or: [
            {
              name: data.contact
            },
            {
              handle: data.contact
            }
          ]
        };
      }

      if (data.interaction) {
        operand = {
          contact_interaction_type: data.interaction
        };

        filter = filter ? {
          $and: [
            operand,
            filter
          ]
        } : operand;
      }

      if (filter != null) {
        if (whoFilters) {
          whoFilters.push(filter);
        }
        else {
          whoFilters = [
            filter
          ];
        }
      }
    }
    else if (type === 'what') {
      if (data.type) {
        filter = {
          type: data.type
        };
      }

      if (filter != null) {
        if (whatFilters) {
          whatFilters.push(filter);
        }
        else {
          whatFilters = [
            filter
          ];
        }
      }
    }
    else if (type === 'when') {
      if ((data.from && data.from.length > 0) || (data.to && data.to.length > 0) || (data.interaction && data['relative-number'] && data['relative-number'].length > 0 && parseInt(data['relative-number']) > 0)) {
        filter = {
          datetime: {}
        };
      }

      if (data.interaction === 'exact') {
        if (data.from) {
          filter.datetime.$gte = data.from;
        }

        if (data.to) {
          filter.datetime.$lte = data.to;
        }
      }
      else if (data.interaction === 'relative' && data['relative-number'].length > 0 && parseInt(data['relative-number']) > 0) {
        if (data['since-exactly'] === 'since') {
          filter.datetime = {
            $gte: moment().subtract(parseInt(data['relative-number']), data.units)
          };
        }
        else if (data['since-exactly'] === 'exactly') {
          filter.datetime = {
            $gte: moment().subtract(parseInt(data['relative-number']), data.units),
            $lte: moment().subtract(parseInt(data['relative-number'] - 1), data.units)
          };
        }
      }

      if (filter != null) {
        if (data.estimated) {
          operand = {
            datetime: {}
          };

          if (data.interaction === 'exact') {
            if (data.from) {
              operand.datetime.$gte = data.from;
            }

            if (data.to) {
              operand.datetime.$lte = data.to;
            }
          }
          else if (data.interaction === 'relative' && data['relative-number'].length > 0) {
            if (data['since-exactly'] === 'since') {
              operand.datetime = {
                $gte: moment().subtract(parseInt(data['relative-number']), data.units)
              };
            }
            else if (data['since-exactly'] === 'exactly') {
              operand.datetime = {
                $gte: moment().subtract(parseInt(data['relative-number']), data.units),
                $lte: moment().subtract(parseInt(data['relative-number'] - 1), data.units)
              };
            }
          }

          filter = {
            $or: [
              operand,
              filter
            ]
          };
        }

        if (whenFilters) {
          whenFilters.push(filter);
        }
        else {
          whenFilters = [
            filter
          ];
        }
      }
    }
    // else if (type === 'where') {
    //   geofilter = $d.data('geofilter');
    //
    //   if (geofilter.type === 'circle') {
    //     coordinates = geofilter.coordinates[0];
    //     radius = (geofilter.layer.getRadius() / 1000).toFixed(3) + 'km';
    //
    //     filter = new filters.GeoFilter('location.geolocation', radius, new filters.Geolocation(coordinates.lat, coordinates.lng));
    //   }
    //   else {
    //     coordinates = geofilter.coordinates;
    //     filter = new filters.GeoFilter('location.geolocation');
    //
    //     for (i = 0; i < coordinates.length; i++) {
    //       filter.addPoint(new filters.Geolocation(coordinates[i].lat, coordinates[i].lng));
    //     }
    //   }
    //
    //   if (data.geometry === 'outside') {
    //     filter = filter.not();
    //   }
    //
    //   if (!data.estimated) {
    //     operand = new filters.TermFilter('location.estimated', false);
    //     filter = filter.and(operand);
    //   }
    //
    //   if (filter != null) {
    //     if (whereFilters) {
    //       whereFilters.push(filter);
    //     }
    //     else {
    //       whereFilters = [
    //         filter
    //       ];
    //     }
    //   }
    // }
    else if (type === 'connector') {
      if (data.connection) {
        filter = {
          connection: data.connection
        };
      }
      else if (data.provider) {
        filter = {
          provider_name: data.provider.toLowerCase()
        }
      }

      if (filter != null) {
        if (connectorFilters) {
          connectorFilters.push(filter);
        }
        else {
          connectorFilters = [
            filter
          ];
        }
      }
    }
  }

  if (tags != null) {
    for (let i = 0; i < tags.length; i++) {
      let slugifiedTag = tags[i].slice(1).toLowerCase().replace(/[^a-zA-Z0-9-]+/g, '-');

      if (tagFilters) {
        connectorFilters.push(slugifiedTag);
      }
      else {
        tagFilters = [
          slugifiedTag
        ];
      }
    }
  }

  if (connectorFilters != null && connectorFilters.length > 0) {
    filters.connectorFilters = connectorFilters;
  }

  if (tagFilters != null && tagFilters.length > 0) {
    filters.tagFilters = tagFilters;
  }

  if (whoFilters != null && whoFilters.length > 0) {
    filters.whoFilters = whoFilters;
  }

  if (whatFilters != null && whatFilters.length > 0) {
    filters.whatFilters = whatFilters;
  }

  if (whenFilters != null && whenFilters.length > 0) {
    filters.whenFilters = whenFilters;
  }

  // if (whereFilters != null && whereFilters.length > 0) {
  //   filters.whereFilters = whereFilters;
  // }

  return filters;
}
