
function Tree(){
    this.id = '';
    this.tag = '';
    this.opentag = '';
    this.closetag = '';
    this.children = [];
    this.meta = {};

};

var treeUtils = {
    makeString: function (tree) {
        var r = this.makeStringRec(tree);
        return r
    },
    makeStringRec: function (tree) {
        var result = '';
        if (tree instanceof Tree || tree instanceof Object) {
            if (tree.opentag)
                result = tree.opentag;
            if (tree.tag)
                result = result + tree.tag;

            if (tree.children)
                if (tree.children.length > 0) {
                    for (var index in tree.children) {
                        var node = tree.children[index];
                        result = result + this.makeStringRec(node);
                    }
                }
            if (tree.closetag)
                result = result + tree.closetag;
        }
        else {
            for (var index in tree) {
                result = result + tree[index];
            }

        }
        return result;
    }
}

