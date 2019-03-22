import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const MainFooter = ({ className,footerLogo, links, copyright }) => {
  const clsString = classNames(styles.mainFooter, className);
  return (
    <div className={clsString}>
      <div className={styles.footerIntro}>
        {links && (
          <div className={styles.footerLeft}>
            <div className={styles.footerKind}>集团简介</div>
            <div>
              <ul className={styles.footerComp}>
                {links.map((link) => (
                  <li key={link.title}>
                    <a target={link.blankTarget ? '_blank' : '_self'} href={link.href}>
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className={styles.footerRight}>
          <p>
            <img src={footerLogo} alt="" />
          </p>
          {copyright}
        </div>
      </div>
    </div>
  );
};

export default MainFooter;
