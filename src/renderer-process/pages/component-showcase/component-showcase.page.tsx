import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate, useNavigation, useParams } from 'react-router-dom'
import ColorPickerComponent from '../../components/color-picker/color-picker.component';
import DpiEditorComponent from '../../components/dpi-editor/dpi-editor.component';
import MacroEditorComponent from '../../components/macro-editor/macro-editor.component';
import MessageDialogComponent from '../../components/message-dialog/message-dialog.component';
import OptionSelectComponent from '../../components/option-select/option-select.component';
import RangeComponent from '../../components/range/range.component';
import ToggleComponent from '../../components/toggle/toggle.component';
import TooltipComponent from '../../components/tooltip/tooltip.component';
import './component-showcase.page.css'

function ComponentShowcasePage() {
  // const navigate = useNavigate();
  // const location = useLocation();
  const { subpage } = useParams();

  // const navLinkState = location.state;
  // if(navLinkState == null)
  // {
  //   useEffect(() =>
  //   {
  //     navigate("/");
  //   });
  //   return <></>;
  // }

  const options = 
  [
    { value: 'one', label: "One" },
    { value: 'two', label: "Two" },
    { value: 'three', label: "Three" },
  ];


  let [testDialogOpen, setTestDialogOpen] = useState(false);
  const handleClick_testDialog = () =>
  {
    setTestDialogOpen(true);
  }


  // console.log(subpage);

  return (<><ul className="tabs">
  <li>
    <NavLink to="/component-showcase/widgets">
      <img className="icon" src="" />
      <span className="label">Widgets</span>
    </NavLink>
  </li>
  <li>
    <NavLink to="/component-showcase/inputs">
      <img className="icon" src="" />
      <span className="label">Inputs &amp; Buttons</span>
    </NavLink>
  </li>
  <li>
    <NavLink to="/component-showcase/dialogs">
      <img className="icon" src="" />
      <span className="label">Dialogs</span>
    </NavLink>
  </li>
  <li>
    <NavLink to="/component-showcase/utilities">
      <img className="icon" src="" />
      <span className="label">Utilities</span>
    </NavLink>
  </li>
</ul>
{ (subpage != null) ? <div className="page">
    { (subpage == "inputs") ? <>
    <section>
    <header>Buttons</header>
      <button className="glorious" type="button" onClick={() =>
      {
        // eyedropper works outside of window (in browsers; should also in electron);
        new (window as any).EyeDropper().open().then(console.log);
      }}>Glorious</button>
      <button className="secondary" type="button">Secondary</button>
      <button className="hollow" type="button">Hollow</button>
    </section>
    <section>
      <header>Inputs</header> <div>   
        <label className="field">
          <span className="label">Options Select Component</span>
          <OptionSelectComponent options={options} />
          <span className="result"></span>
        </label>
      </div>
      <div>        
        <label className="field">
          <span className="label">Toggle Component</span>
          <ToggleComponent />
        </label>
      </div>
      <div>
        <label className="field">
          <span className="label">Range Component</span>
          <RangeComponent />
          <span className="result"></span>
        </label>
      </div>
      <div>
        <label className="field">
          <span className="label">Color Picker Component</span>
          <ColorPickerComponent />
          <span className="result"></span>
        </label>
      </div>
    </section>
    </>: null }
    { (subpage == "widgets") ? <>
    <div>
      <span className="label">Tooltip</span>
      <TooltipComponent message="Displays on click. Click anywhere to close message." />
    </div>
    <div>
      <span className="label">Tooltip using hover</span>
      <TooltipComponent message="Displays on hover. Move mouse off of tooltip to close message." hover={true} />
    </div>
    
    <div>
      <span className="label">Tooltip with Rich Content</span>
      <TooltipComponent>
        <p>This is a tooltip from child elements</p>
        <div>Any html can be used here and will be rendered as the message.</div>
      </TooltipComponent>
    </div>
    </>: null }
    { (subpage == "dialogs") ? <>
    <MessageDialogComponent message="Test dialog message" title="Test" open={testDialogOpen} okOnClick={() => { setTestDialogOpen(false); }} />
    <button onClick={handleClick_testDialog}>Open Test Dialog</button>
    </>: null }
    { (subpage == "utilities") ? <>
    <MacroEditorComponent />
    <DpiEditorComponent />
    </>: null }
</div> : null}
  </>)
}

export default ComponentShowcasePage