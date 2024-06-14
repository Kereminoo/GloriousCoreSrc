import Icon from '../icon/icon';
import style from './content-dialog.module.css';

export type ContentDialogProps =
{
  open?: boolean;
  actions?: Element[];
  title?: string;
  icon?: typeof Icon;
  className?: string;
}

function ContentDialogComponent<ContentDialogProps>({ open, actions, title, icon, children, className }) 
{
  return (<dialog open={open} className={`modal${(className == null) ? '' : ` ${className}`}`}>
    <header className={style["header"]}>
      {icon}
      {title}
    </header>
    <section className={style["body"]}>{children}</section>
    <footer className={style["footer"]}>
      {actions}
    </footer>
  </dialog>)
}

export default ContentDialogComponent;