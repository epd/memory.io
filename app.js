$(function() {
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
       var title = this.model.get('title');
       $(this.el).html(title);
       return this;
     },
   });

  AppView = Backbone.View.extend({
    el: $("#buckets"),

    /**
     * Initialization
     */
     initialize: function() {
       _.bindAll(this, 'addSingleBucket', 'addExistingBuckets');
       this.input = this.$("#create-bucket");
       Buckets.bind("add", this.addSingleBucket);
       Buckets.bind("reset", this.addExistingBuckets);
       Buckets.fetch();
     },

    /**
     * Event listeners
     */
     events: {
       "keypress #create-bucket": "newBucketOnEnter",
     },

    /**
     * Event callbacks
     */
     // Create a new Bucket on submit of input field
     newBucketOnEnter: function(e) {
       if (e.keyCode !== 13) {
         return;
       }
       var i = $("#create-bucket");
       if (i && this.input.val()) {
         Buckets.create({title: this.input.val()})
       }
       i.val('');
     },
     // Add a single Bucket to our Store
     addSingleBucket: function(bucket) {
       var view = new BucketView({model: bucket});
       this.$("#bucket-lists").append(view.render().el);
     },
     // Add our existing Buckets from our Store
     addExistingBuckets: function() {
       Buckets.each(this.addSingleBucket);
     },
  });
  App = new AppView;
});
