import './message-dialog.component.css'

function MessageDialogComponent(props: any) 
{
  const { open, message, okOnClick, title, icon } = props;

  return (<dialog open={open}>
    <header>{icon}{title}</header>
    <section>{message}</section>
    <footer>
      <button type="button" onClick={okOnClick}>Ok</button>
    </footer>
  </dialog>)
}

export default MessageDialogComponent;