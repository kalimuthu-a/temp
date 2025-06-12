import React from 'react';
import PropTypes from 'prop-types';

function SavedPassengers() {
  const imagePresent = false;
  const firstName = 'Aman';
  const lastName = 'Pal';
  const cards = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div>
      <div className="skyplus-addon-filter__search rounded-pill p-5 border">
        <i className="icon-search me-5" />
        <input
          type="text"
          name="search"
          autoComplete="off"
          placeholder="Search"
          maxLength="20"
        />
      </div>

      {
        cards.map((item, index) => (
          <div className="mt-10 rounded border-1 p-5 border" key={index}>
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                {imagePresent ? (
                  <div className="profile-img-avatar">
                    <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlQMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAgMFBgcBBP/EADsQAAICAQIEAQgIBAcBAAAAAAABAgMEBREGEjFBIRMiUWFxgZHRFEJSYnKhscEHMjNDFSQ0gpKy4SP/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AOuAAAerqeEorcD2KLoojFFqAAAADG5uv6XhScb8yvnXWMPPf5GNfGukp+CyGvT5MDZAYbE4o0fKkoxyvJyfRWxcPz6GYTUknFpp9GnuB6RaJACicStn0SRTJAQAAE6e4FPcAQAABFkUVxL4ICcUSPEJNRi3J7JdQMdrms4+j4ysuTnZPwrrj1k/2XrOe6rr2oam5K65wpf9mvwjt6/T7yGu6jPVNTuyH/T3cKl6IJ+Hz95jwAAKgZTRddzNIsXkJ89G/nUSfmv2ehmLAHWtJ1PH1XFV+K/VOD/mg/Qz7Tk2jandpObDIp3celle/hOPoOqY19eVj130S5q7IqUX6URVjW5VNFxCaA+dnnYlJEewE6e4FPcAQAAEol0SqJdHoBMxPFWU8TQcucXtKcfJp+uXh+m5ljV/4hTa0nHiukshb+5MDQAAVAAAAAAN9/h/lu3T78SX9ie8fZLd/qmaEbZ/DttZ+YuzqTfxA3sjIkeSIqiZWy2ZUwJ09wKe4AgO4AE4F8SiBfECRhOMsR5eg3bLeVLVq93X8mzNnzapd9H0zLucOdQplLlfR+DA5CB29AKgAAAAAG9fw9xPJ4eTlzX9aahB+qPX83+Rop1DhO2q3h/EdNfJGMXFrfum9372Blzxnp4yKqmUstmVMCdPcCnuAIAACcWXR6FES6DAsPn1Gt3adlVJbudM4r/iz6OwA4uuh6ZzizR5aXnuytf5a+TlW/svq4mDKgAAAAAHTuDq/J8OYm/1lKfxkznGDiX5+XXjY0ea2x7L0L0t+o61h48cTEpx4eMaoKCfsRFXHkj0jICqZUycyDAnT3Ap7gCAAA9RbBlROLAvR6QiyYGL4l07/E9ItpjHe2Pn1fiXb3+KOWPdPZpp99zs5yXWuT/Gc7yX8n0ie23tKPiAAQAAG/cB6YsfBln2R/8ArkeEN+0F8zaT49Fh5PSMKHooh+h9hFCE34EpPYqmwK5Mj2PWedgJ09wKe4AgAAB6meAC+DLEfNzqC5ptRiu7exj8ziXS8NPmyY2zX1KfOfyAzEpqPKpPZyfKvWzmnFGi2aVmOxc0sa6Tdc32fVxfrLM/ifJytWx8yKddONPeFW/Vd9/S2vA6BbVi6ngqNkI2498E1v6H4r3gchBntf4ZytLlO2lO/E688V4wX3l+5g6q53WRrqhKc5PaMY+LZURMlo+h5usT5caHLV0ldPwivm/UjY9B4L35L9Y9qx4v/s/2RucI1Y9PLCMaqq10S2UURXz4nNCpUW7eUqSi9ujXZr2l5zmzie+PEc9QqcpUf0/Jb+Eq/n395v2LlU5mPDIxpqdU1vFoCyTKpM9lIgB4AAJ09wKe4AgN/Dc1PUOMYpyhp9HNt/dt8E/ZE13O1bOz/wDU5M5R+wntH4IDes/iDTcLeM8hWWL6lXnP5I1zP4vyrk4YVcaI/al50vka2CouycrIypc2RfZa/vybKQAB0XgfO+k6MqJPz8eXJt93qv3XuOdGwcE5v0XWFVJvkyI8n+5eK/f4gbxrWpVaXp9uTalJpcsIP68n0RpPCWqxx9dbvrqjDLfK3GCXJJ9NvQt/DYv4/nkPNxlP/Tcm9f4t/H39DVunju160RXazWeOtU+h6asSqW12V4PbtBdfj0Mzpdl89NxZ5aUbnVF2e3Y5lxBqL1TVrshPevflq/Cunx6+8DHF2NlZGJPnxb7Kpd+SW2/zKQVGw4fF2oU7RyI15EfS1yy+KM3h8Wade0rufHl9+O6+KNDAHV6MinIgp0Wwsi+8JJlm5yeq2ymanTZOuS+tGWzM3g8VahjNK/lyYfeW0viiK6BT3BhtP4o0q6tytv8Ao8vDeFif6rqeAc7ABUAAAAAAnTbOi6FtfhOuSlH2ogAOha9GjUuG53voqvL1yXZpb/8AhomBXGzPx65/yytimvVujN4eoc3B+XjSfnVSUF+GTTX7o1+ubqnGyP8ANCSkvavEiup69lLD0bMu32arcY+1+C/U5V0WyN0441GNmBh0VS3WRtc9vspeH5v8jSyoAAAAAAAAAAAAAAAAAAAAAJRnKMZRT82aXMvTt0IgAW3X2XqpWycvJQVcPVFb/MqAAAAAAAAAAAAD/9k=" alt="Profile" />
                  </div>
                )
                  : (
                    <div className="profile-img-avatar">
                      {firstName.charAt(0).toUpperCase()}{lastName.charAt(0).toUpperCase()}
                    </div>
                  )}
                <div>
                  <p className="body-medium-regular">Aman Pal (you)</p>
                  <p className="body-small-regular">Adult | Male | 28 year | 6E Prime</p>
                </div>
              </div>
              <div>
                <i className="icon-accordion-down-simple" />
              </div>
            </div>
            <div className="d-flex justify-content-between m-5 bg-accent-light p-3 rounded">
              <div className="d-flex align-items-center">
                <i className="icon-seat m-2" />
                <p className="body-small-regular">Window</p>
              </div>
              <div className="d-flex align-items-center">
                <i className="icon-veg m-2" />
                <p className="body-small-regular">Veg</p>
              </div>
              <div className="d-flex align-items-center">
                <i className="icon-calender m-2" />
                <p className="body-small-regular">Aadhar+2</p>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}
SavedPassengers.propTypes = {};
export default SavedPassengers;
