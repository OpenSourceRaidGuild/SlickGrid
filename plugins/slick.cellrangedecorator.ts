type CellRangeDecoratorOptions = {
  cellDecorator?: any;
  selectionCss?: { [cssRule: string]: string | number | boolean };
  selectionCssClass: string;
  offset?: {
    top: number,
    left: number,
    height: number,
    width: number,
  }
};

/** @todo replace with SlickGrid when added */
type Grid = any;

type CellRangeDecoratorFunction = (grid: Grid, options: CellRangeDecoratorOptions) => void;

/** @todo this should be probably extracted to a shared interface folder  */
export interface CellRange {
  /** Selection start from which cell? */
  fromCell: number;

  /** Selection start from which row? */
  fromRow: number;

  /** Selection goes to which cell? */
  toCell: number;

  /** Selection goes to which row? */
  toRow: number;
}

(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "CellRangeDecorator": CellRangeDecorator
    }
  });

  /***
   * Displays an overlay on top of a given cell range.
   *
   * TODO:
   * Currently, it blocks mouse events to DOM nodes behind it.
   * Use FF and WebKit-specific "pointer-events" CSS style, or some kind of event forwarding.
   * Could also construct the borders separately using 4 individual DIVs.
   *
   * @param {Grid} grid
   * @param {Object} options
   */
  function CellRangeDecorator(this: CellRangeDecoratorFunction, grid: Grid, options: CellRangeDecoratorOptions) {
    var _elem: JQuery<HTMLElement> | null;
    var _defaults = {
      selectionCssClass: 'slick-range-decorator',
      selectionCss: {
        "zIndex": "9999",
        "border": "2px dashed red"
      },
      offset: {
        top: -1,
        left: -1,
        height: -2,
        width: -2
      }
    };

    options = $.extend(true, {}, _defaults, options);


    function show(range: CellRange) {
      if (!_elem) {
        _elem = $("<div></div>", {css: options.selectionCss})
          .addClass(options.selectionCssClass)
          .css("position", "absolute")
          .appendTo(grid.getActiveCanvasNode());
      }

      var from = grid.getCellNodeBox(range.fromRow, range.fromCell);
      var to = grid.getCellNodeBox(range.toRow, range.toCell);

      if (from && to && options && options.offset) {
        _elem.css({
          top: from.top + options.offset.top,
          left: from.left + options.offset.left,
          height: to.bottom - from.top + options.offset.height,
          width: to.right - from.left + options.offset.width
        });
      }

      return _elem;
    }

    function destroy() {
      hide();
    }

    function hide() {
      if (_elem) {
        _elem.remove();
        _elem = null;
      }
    }

    $.extend(this, {
      "pluginName": "CellRangeDecorator",
      "show": show,
      "hide": hide,
      "destroy": destroy
    });
  }
})(jQuery);
