(function($) {
  /**
   * Bucket Lists
   */
  // Model
  Bucket = Backbone.Model.extend();

  // Collection
  window.BucketList = Backbone.Collection.extend({
    model: Bucket,
    localStorage: new Store("buckets"),
  });
  window.Buckets = new BucketList;

  // View
  window.BucketView = Backbone.View.extend({
    tagName: "li",
    render: function() {
      $(this.el)
        .attr("data-id", this.model.get('id'))
        .html('<a href="javascript:void(0);">' + this.model.get('title') + '</a>');
      return this;
    },
  });

  AppView = Backbone.View.extend({
    el: $("#app"),

    /**
     * Initialization
     */
    initialize: function() {
      _.bindAll(this, 'render', 'addBucket');
      Buckets.bind("add", this.addBucket);
      Buckets.bind("destroy", this.render);
      Buckets.fetch();
      this.render();
    },

    // View setup
    render: function () {
      // Bucket list wrapper
      if (!this.wrapper) {
        this.wrapper = $('<section/>', {id: 'bucket-lists'}).appendTo(this.el);

        $('<h1/>', {text: 'My Bucket List'})
          .appendTo('<header/>')
          .appendTo(this.wrapper);

        this.input = $('<input/>', {
          placeholder: 'What do you want to do...',
          id: 'create-bucket'
        }).appendTo(this.wrapper);

        this.list = $('<ul/>').appendTo(this.wrapper);
      }

      // Populate our list with existing Buckets
      this.list.html('');
      Buckets.each(this.addBucket);
    },

    /**
     * Event listeners
     */
    events: {
      "keypress #create-bucket": "createBucket",
      "click #bucket-lists a": "removeBucket",
    },

    /**
     * Event callbacks
     */
    // Create a new Bucket on submit of input field
    createBucket: function(e) {
      // Only continue if Enter key is pressed
      if (e.keyCode !== 13) {
        return;
      }

      // Create our new list if not blank
      var i = $("#create-bucket");
      if (i && this.input.val()) {
        Buckets.create({
          title: this.input.val()
        })
      }
      i.val('');
    },

    // Add a single Bucket to our Store
    addBucket: function(bucket) {
      var view = new BucketView({model: bucket});
      this.$("#bucket-lists ul").append(view.render().el);
    },

    // Remove a single Bucket from the Store
    removeBucket: function(e) {
      var id = $(e.target).parents("li").data("id")
        , current = Buckets.get(id);
      current.destroy();
    },
  });
  App = new AppView;
})(jQuery);
