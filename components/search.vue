<template slot="search">
  <div id="search-bar" class="input-group">
    <div v-if="!hide_advanced" id="advanced" v-on:click="toggleFilterEditor">
      <i v-bind:class="$data.editorOpen ? 'fa-caret-up' : 'fa-caret-down'" class="fa"></i>
    </div>

    <div v-if="!hide_advanced && $data.editorOpen" id="filter-controls">
      <div id="filter-editor">
        <div id="filter-buttons">
          <div class="control" data-type="who" v-on:click="createBlankFilter('who')">
            <i class="fa fa-user"></i>
          </div>

          <div class="control" data-type="what" v-on:click="createBlankFilter('what')">
            <i class="fa fa-picture-o"></i>
          </div>

          <div class="control" data-type="when" v-on:click="createBlankFilter('when')">
            <i class="fa fa-calendar"></i>
          </div>

          <div class="control" data-type="connector" v-on:click="createBlankFilter('connector')">
            <i class="fa fa-plug"></i>
          </div>

          <div class="control" data-type="where" v-on:click="createBlankFilter('where')">
            <i class="fa fa-globe"></i>
          </div>
        </div>

        <div id="filter-values">
          <div id="filter-name" v-if="$data.activeFilter.type != null">
            <div class="text-box">
              <input type="text" name="name" v-model="activeFilter.name" placeholder="Name this filter"/>
            </div>
          </div>

          <form v-if="$data.activeFilter && $data.activeFilter.type === 'who'" class="who"
                v-on:submit.self.prevent="saveFilter">
            <div class="input-container">
              <label v-bind:class="{active: ['to', 'from', 'with'].includes($data.activeFilter.data.interaction) === false}" class="radio" for="who-type-1">
                <input id="who-type-1" type="radio" name="interaction" value="" v-model="activeFilter.data.interaction"/>
                <span>Any</span>
              </label>

              <label v-bind:class="{active: $data.activeFilter.data.interaction === 'to' }" class="radio" for="who-type-2">
                <input id="who-type-2" type="radio" name="interaction" value="to" v-model="activeFilter.data.interaction"/>
                <span>To</span>
              </label>

              <label v-bind:class="{active: $data.activeFilter.data.interaction === 'from' }" class="radio" for="who-type-3">
                <input id="who-type-3" type="radio" name="interaction" value="from" v-model="activeFilter.data.interaction"/>
                <span>From</span>
              </label>

              <label v-bind:class="{active: $data.activeFilter.data.interaction === 'with' }" class="radio" for="who-type-4">
                <input id="who-type-4" type="radio" name="interaction" value="with" v-model="activeFilter.data.interaction"/>
                <span>With</span>
              </label>
            </div>
            <div class="text-box">
              <input type="text" name="contact" placeholder="Contact Name" v-model="activeFilter.data.contact"/>
            </div>

            <div id="filter-done">
              <button v-if="$data.activeFilter.id" class="primary">Save Filter</button>
              <button v-else class="primary">Add Filter</button>
            </div>
          </form>

          <form v-if="$data.activeFilter && $data.activeFilter.type === 'what'" class="what" v-on:submit.self.prevent="saveFilter">
            <div class="input-container">
              <select name="type">
                <option v-model="activeFilter.data.type" value=""></option>
                <option v-model="activeFilter.data.type" value="achievement">Achievement</option>
                <option v-model="activeFilter.data.type" value="audio">Audio</option>
                <option v-model="activeFilter.data.type" value="code">Code</option>
                <option v-model="activeFilter.data.type" value="file">File</option>
                <option v-model="activeFilter.data.type" value="game">Game</option>
                <option v-model="activeFilter.data.type" value="image">Image</option>
                <option v-model="activeFilter.data.type" value="receipt">Receipt</option>
                <option v-model="activeFilter.data.type" value="software">Software</option>
                <option v-model="activeFilter.data.type" value="text">Text</option>
                <option v-model="activeFilter.data.type" value="video">Video</option>
                <option v-model="activeFilter.data.type" value="web-page">Web Page</option>
              </select>
            </div>

            <div id="filter-done">
              <button v-if="$data.activeFilter.id" class="primary">Save Filter</button>
              <button v-else class="primary">Add Filter</button>
            </div>
          </form>

          <form v-if="$data.activeFilter && $data.activeFilter.type === 'when'" class="when" v-on:submit.self.prevent="saveFilter">
            <div class="input-container">
              <label class="radio active" for="when-exact">
                <input id="when-exact" type="radio" name="interaction" value="exact" v-model="activeFilter.data.interaction" />
                Exact dates
              </label>

              <label class="radio" for="when-relative">
                <input id="when-relative" type="radio" name="interaction" value="relative" v-model="activeFilter.data.interaction" />
                Relative dates
              </label>
            </div>

            <div v-if="$data.activeFilter.data.interaction === 'exact'" class="exact-controls">
              <div>
                From:
              </div>


              <div class="input-group" id="from">
                <date-picker v-model="activeFilter.data.from" v-bind:config="fromConfig"></date-picker>
                <div class="input-group-addon"><span class="fa fa-calendar"></span></div>
              </div>

              <div>
                To:
              </div>

              <div class="input-group" id="to">
                <date-picker v-model="activeFilter.data.to" v-bind:config="toConfig"></date-picker>
                <div class="input-group-addon"><span class="fa fa-calendar"></span></div>
              </div>
            </div>

            <div v-if="$data.activeFilter.data.interaction === 'relative'" class="relative-controls">
              <div class="input-container">
                <select name="since-exactly">
                  <option value="since">Since</option>
                  <option value="exactly">Exactly</option>
                </select>
              </div>

              <div class="text-box">
                <input type="number" name="relative-number" min="1">
              </div>

              <div class="input-container">
                <select name="units">
                  <option value="days">Day(s) ago</option>
                  <option value="weeks">Week(s) ago</option>
                  <option value="months">Month(s) ago</option>
                  <option value="years">Year(s) ago</option>
                </select>
              </div>
            </div>

            <div class="estimated">
              <label>
                <input type="checkbox" name="estimated"/>
                <span>Return Estimated Results</span>
              </label>
            </div>

            <div id="filter-done">
              <button v-if="$data.activeFilter.id" class="primary">Save Filter</button>
              <button v-else class="primary">Add Filter</button>
            </div>
          </form>

          <form v-if="$data.activeFilter && $data.activeFilter.type === 'connector'" class="connector" v-on:submit.self.prevent="saveFilter">
            <div class="input-container">
              <label class="radio active" for="provider"><input id="provider" type="radio" name="type" value="provider" checked/>Connection Type</label>
              <label class="radio" for="connection"><input id="connection" type="radio" name="type" value="connection"/>Connection</label>
            </div>

            <div class="provider">
              <div class="input-container">
                <select name="provider">
                  <option></option>
                </select>
              </div>
            </div>

            <div class="connection hidden">
              <div class="input-container">
                <select name="connection">
                  <option></option>
                </select>
              </div>
            </div>

            <div id="filter-done">
              <button v-if="$data.activeFilter.id" class="primary">Save Filter</button>
              <button v-else class="primary">Add Filter</button>
            </div>
          </form>

          <form v-if="$data.activeFilter && activeFilter.type === 'where'" class="where"
                v-on:submit.self.prevent="saveFilter">
            <div>
              Distance:
            </div>

            <div class="text-box">
              <input type="text" name="distance"/>
            </div>

            <div>
              Area:
            </div>

            <div class="input-container">
              <label for="where-type-1"><input id="where-type-1" type="radio" name="geometry" value="inside" checked/>Inside</label>
              <label for="where-type-2"><input id="where-type-2" type="radio" name="geometry" value="outside"/>Outside</label>
            </div>

            <div class="estimated">
              <label>
                <input type="checkbox" name="estimated"/>
                <span>Return Estimated Results</span>
              </label>
            </div>

            <div id="filter-done">
              <button v-if="$data.activeFilter.id" class="primary">Save Filter</button>
              <button v-else class="primary">Add Filter</button>
            </div>
          </form>
        </div>
      </div>

      <div id="filter-list" class="flex-grow">
        <div class="filter" v-for="filter in $data.filters">
          <span v-if="filter && filter.name" v-on:click="loadFilter(filter)">{{ filter.name }}</span>
          <span v-else v-on:click="loadFilter(filter)">{{ filter.type | capitalize }}</span>
          <i class="fa fa-close" v-on:click="deleteFilter(filter)"></i>
        </div>
      </div>
    </div>

    <form id="query-form" method="POST" class="flex-grow" v-on:submit.self.prevent="performSearch">
      <div id="search-box" class="text-box">
        <input id="search-query" type="search" name="search" v-model="query" placeholder="Enter query here"/>
      </div>

      <input class="hidden" type="submit"/>
    </form>


    <div v-if="!hide_filters" id="filters" v-bind:class="{ hidden: $data.editorOpen }">
      <div class="filter" v-for="filter in $data.filters">
        <span v-if="filter && filter.name" v-on:click="loadFilter(filter)">{{ filter.name }}</span>
        <span v-else v-on:click="loadFilter(filter)">{{ filter.type | capitalize }}</span>
        <i class="fa fa-close" v-on:click="deleteFilter(filter)"></i>
      </div>
    </div>

    <div v-if="!hide_filters && !$data.editorOpen && $data.overflowCount > 0" id="filter-overflow-count">+{{ $data.overflowCount }}</div>

    <div v-if="!hide_favorite_star" id="search-favorited" v-bind:class="{filled: $store.state.currentSearch.favorited}">
      <i class="fa"></i>
    </div>

    <div id="search-button">
      <i class="fa fa-search" v-on:click="performSearch"></i>
    </div>
  </div>
</template>

<script>
  import searchFind from '../apollo/mutations/search-find.gql';
  import uuid from '../lib/util/uuid';

  const MAX_FILTER_WIDTH_FRACTION = 0.3;

  export default {
    data: function () {
      return {
        activeFilter: {
          id: null,
          name: null,
          type: null,
          data: {}
        },
        filters: [],
        query: '',
        editorOpen: false,
        overflowCount: 0,
        fromConfig: {
          format: 'MM/DD/YYYY hh:mm A',
          useCurrent: false,
          showClear: true,
          showClose: true
        },
        toConfig: {
          format: 'MM/DD/YYYY hh:mm A',
          useCurrent: false,
          showClear: true,
          showClose: true
        }
      }
    },
    methods: {
      createBlankFilter: function (type) {
        this.$data.activeFilter.id = null;
        this.$data.activeFilter.name = null;
        this.$data.activeFilter.type = type;

        switch (type) {
          case 'who':
            this.$data.activeFilter.data = {
              interaction: '',
              contact: ''
            };

            break;

          case 'what':
            this.$data.activeFilter.data = {
              type: ''
            };

            break;

          case 'when':
            this.$data.activeFilter.data = {
              interaction: 'exact',
              from: '',
              to: ''
            };

            break;

          case 'connector':
            this.$data.activeFilter.data = {
              type: 'provider',
              provider: ''
            };

            break;
        }
      },

      clearActiveFilter: function () {
        this.$data.activeFilter = {
          id: null,
          name: null,
          type: null,
          data: {}
        }
      },

      loadFilter(filter) {
        this.$data.activeFilter.id = filter.id;
        this.$data.activeFilter.name = filter.name;
        this.$data.activeFilter.data = filter.data;
        this.$data.activeFilter.type = filter.type;
      },

      toggleFilterEditor: function () {
        this.$data.editorOpen = !this.$data.editorOpen;

        if (!this.$data.editorOpen) {
          this.compactOverflowFilters();
        }
      },

      saveFilter: async function () {
        let filter = this.$data.activeFilter;

        if (filter.id == null) {
          let savedFilter = filter;

          savedFilter.id = uuid();

          this.$data.filters.push(savedFilter);
        }
        else {
          let existingFilter = _.find(this.$data.filters, function (item) {
            return filter.id === item.id;
          });

          if (existingFilter) {
            existingFilter.name = filter.name;
            existingFilter.data = filter.data;
          }
        }

        this.clearActiveFilter();

        await this.checkNewSearch();
      },

      deleteFilter(filter) {
        this.$data.filters = _.filter(this.$data.filters, function(item) {
          return filter.id !== item.id;
        });

        this.compactOverflowFilters();

        this.checkNewSearch()
      },

      checkNewSearch: async function (){
        let filters = _.map(this.$data.filters, function(filter) {
          return _.omit(filter, 'id');
        });

        let query = this.$data.query;

        let result = await this.$apollo.mutate({
          mutation: searchFind,
          variables: {
            filters: JSON.stringify(filters),
            query: query
          }
        });

        let data = result.data.searchFind;

        if (data && data.id) {
          this.$store.state.currentSearch = data;
          this.$data.filters = data.filters;
          this.$data.query = data.query
        }
        else {
          this.$store.state.currentSearch = {
            query: query,
            filters: filters
          }
        }
      },

      performSearch: async function() {

      },

      compactOverflowFilters: function() {
        this.$nextTick(function() {
          let hideIndex, maxWidth, width, $filters;

          if (this.$data.editorOpen) {
            return;
          }

          maxWidth = MAX_FILTER_WIDTH_FRACTION * $('#search-bar').width();
          width = 0;
          $filters = $('#filters > .filter');

          $filters.removeClass('hidden');

          $filters.each(function(i, d) {
            let elemWidth = $(d).removeClass('hidden').width();

            if (elemWidth + width > maxWidth) {
              hideIndex = i;

              return false;
            }

            width += elemWidth;
          });

          if (typeof hideIndex !== 'undefined') {
            this.$data.overflowCount = $filters.length - hideIndex;

            $filters.slice(hideIndex).addClass('hidden');
          }
          else {
            this.$data.overflowCount = 0;
          }
        })
      },

      assembleFilters: function () {
        let connectorFilters, tagFilters, whatFilters, whenFilters, whoFilters;

        let filters = {};
        let filterList = this.$data.filters;
        let query = this.$data.query;
        let tags = query.match(/#[A-Za-z0-9-]+/g);

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
                    operand.datetime.$lte = data.to
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
          for (i = 0; i < tags.length; i++) {
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
    },
    props: [
      'hide_advanced',
      'hide_filters',
      'hide_favorite_star'
    ]
  }
</script>
