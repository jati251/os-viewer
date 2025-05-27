import { useEffect, useState } from 'react'


function App() {
 const rawVmList = import.meta.env.VITE_VMS || '';
const vmUrls = rawVmList.split(';').reduce((acc, pair) => {
  const [name, url] = pair.split(',');
  if (name && url) {
    acc[name.trim()] = url.trim();
  }
  return acc;
}, {});

const vmNames = Object.keys(vmUrls);
const [selectedVm, setSelectedVm] = useState(vmNames[0] || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

 

   useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768); // mobile breakpoint
      if (window.innerWidth > 768) setSidebarOpen(true); // open sidebar on desktop
      else setSidebarOpen(false); // close sidebar on mobile by default
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (

    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      
      {/* Hamburger button on mobile */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'fixed',
            top: 10,
            left: 10,
            zIndex: 1000,
            padding: '10px',
            fontSize: '1.5rem',
            background: '#222',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      {(sidebarOpen || !isMobile) && (
        <nav
          style={{
            width: '200px',
            backgroundColor: '#222',
            color: 'white',
            padding: '1rem',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            position: isMobile ? 'fixed' : 'relative',
            top: 0,
            left: 0,
            height: '100vh',
            zIndex: 999,
            overflowY: 'auto',
            transition: 'transform 0.3s ease',
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            boxShadow: isMobile ? '2px 0 5px rgba(0,0,0,0.5)' : 'none',
          }}
        >
          {Object.keys(vmUrls).map(vm => (
            <button
              key={vm}
              onClick={() => {
                setSelectedVm(vm);
                if (isMobile) setSidebarOpen(false); // close sidebar on mobile after selection
              }}
              style={{
                background: selectedVm === vm ? '#555' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '10px',
                marginBottom: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            >
              {vm.toUpperCase()}
            </button>
          ))}
        </nav>
      )}

      {/* Iframe fills rest of the space */}
      <iframe
        src={vmUrls[selectedVm]}
        title={`${selectedVm} console`}
        style={{
          flexGrow: 1,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </div>
  );
}

export default App
