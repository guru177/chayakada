import { MENU } from "../data";

export function MenuBoard() {
  return (
    <div className="col">
      <div className="kicker" style={{ marginBottom: 8 }}>
        The Menu Board
      </div>
      <div className="menu-rule" />
      <div className="menu-shell" style={{ marginTop: 10 }}>
        <div className="chalkboard">
          <div className="menu-head">
            <div className="menu-today font-chalk">— Today's Menu —</div>
            <div className="menu-welcome font-malayalam font-chalk">ചായ കടയിലേക്ക് സ്വാഗതം</div>
            <div className="menu-welcome-en font-chalk">Welcome to the Chai Kada</div>
          </div>
          <div className="dash" />
          {MENU.map((item) => (
            <div className="menu-item" key={item.ml}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="menu-item-name font-malayalam font-chalk">{item.ml}</div>
                <div className="menu-item-en font-chalk">{item.en}</div>
              </div>
              <div className="dots" />
              <span className="price font-chalk">{item.price}</span>
            </div>
          ))}
          <div className="dash" />
          <div className="special font-chalk">✦ Today's special: Extra strong kattan ✦</div>
        </div>
        <div className="wood-grain" />
      </div>
    </div>
  );
}
